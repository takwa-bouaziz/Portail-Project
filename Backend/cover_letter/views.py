import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CoverLetter
import json

# Replace with your Hugging Face API Token
HF_API_TOKEN = "your_hugging_face_token_here"
HF_API_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct"

def call_hf_api(prompt):
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {
        "inputs": prompt,
        "parameters": {"max_new_tokens": 500}
    }
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            return result[0].get('generated_text', '')
        return str(result)
    except Exception as e:
        return f"Error calling AI API: {str(e)}"

@api_view(['POST'])
def generate_cover_letter(request):
    data = request.data
    candidate_name = data.get('candidate_name')
    job_title = data.get('job_title')
    company_name = data.get('company_name')
    cv_text = data.get('cv_text')
    job_description = data.get('job_description')

    if not all([candidate_name, job_title, company_name, cv_text, job_description]):
        return Response({"error": "All fields are required"}, status=status.HTTP_400_BAD_REQUEST)

    prompt = f"""
    Generate a professional and compelling cover letter for the following position.
    Candidate: {candidate_name}
    Post: {job_title}
    Company: {company_name}
    CV Context: {cv_text[:1000]}
    Job Description: {job_description[:1000]}

    The letter should be formal, demonstrate enthusiasm, and highlight key matches between the CV and the job description.
    """

    generated_text = call_hf_api(prompt)

    # Save to database
    cover_letter = CoverLetter.objects.create(
        candidate_name=candidate_name,
        job_title=job_title,
        company_name=company_name,
        cv_text=cv_text,
        job_description=job_description,
        generated_letter=generated_text
    )

    return Response({
        "id": cover_letter.id,
        "generated_letter": generated_text
    }, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_cover_letter(request, pk):
    try:
        cover_letter = CoverLetter.objects.get(pk=pk)
        return Response({
            "candidate_name": cover_letter.candidate_name,
            "job_title": cover_letter.job_title,
            "company_name": cover_letter.company_name,
            "generated_letter": cover_letter.generated_letter,
            "created_at": cover_letter.created_at
        })
    except CoverLetter.DoesNotExist:
        return Response({"error": "Cover letter not found"}, status=status.HTTP_404_NOT_FOUND)
