from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CoverLetter
from ai_client import call_hf_api, HuggingFaceConfigError

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

    try:
        generated_text = call_hf_api(prompt)
    except HuggingFaceConfigError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        return Response(
            {"error": f"Error calling AI API: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # Save to database
    cover_letter = CoverLetter.objects.create(
        user=request.user if request.user.is_authenticated else None,
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
