from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import InterviewSession, InterviewQuestion, InterviewAnswer
import json
from ai_client import call_hf_api, HuggingFaceConfigError

@api_view(['POST'])
def start_interview(request):
    data = request.data
    job_title = data.get('job_title')
    cv_text = data.get('cv_text')

    if not job_title or not cv_text:
        return Response({"error": "job_title and cv_text are required"}, status=status.HTTP_400_BAD_REQUEST)

    # Create session
    session = InterviewSession.objects.create(job_title=job_title, cv_text=cv_text)

    # Prompt to generate 5 questions
    prompt = f"""
    Based on the following job title and candidate CV, generate exactly 5 relevant interview questions.
    Job Title: {job_title}
    CV Context: {cv_text[:1000]}

    Format the output as a JSON list of strings, like this: ["Question 1", "Question 2", ...]
    Only output the JSON list.
    """

    try:
        ai_response = call_hf_api(prompt)
    except HuggingFaceConfigError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        return Response(
            {"error": f"Error calling AI API: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )
    
    try:
        # Try to find JSON in response
        import re
        json_match = re.search(r'\[.*\]', ai_response, re.DOTALL)
        if json_match:
            questions_list = json.loads(json_match.group(0))
        else:
            # Fallback if AI doesn't return clean JSON
            questions_list = [q.strip() for q in ai_response.split('\n') if q.strip()][:5]
    except:
        questions_list = ["Can you tell me about your experience related to this role?", "What are your core strengths?", "How do you handle challenging situations?", "Why are you interested in this company?", "Describe a successful project you worked on."]

    # Save questions
    for i, q_text in enumerate(questions_list):
        InterviewQuestion.objects.create(session=session, question_text=q_text, order=i+1)

    return Response({
        "session_id": session.id,
        "questions": [{"id": q.id, "text": q.question_text, "order": q.order} for q in session.questions.all()]
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def submit_answer(request):
    data = request.data
    question_id = data.get('question_id')
    answer_text = data.get('answer_text')

    if not question_id or not answer_text:
        return Response({"error": "question_id and answer_text are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        question = InterviewQuestion.objects.get(pk=question_id)
    except InterviewQuestion.DoesNotExist:
        return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

    # Prompt for feedback and score
    prompt = f"""
    Evaluate the following interview answer for the question provided.
    Question: {question.question_text}
    Answer: {answer_text}

    Provide a short feedback and a score from 0 to 10.
    Format your response as: Score: [X/10] Feedback: [Your feedback]
    """

    try:
        ai_response = call_hf_api(prompt)
    except HuggingFaceConfigError as exc:
        return Response({"error": str(exc)}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    except Exception as exc:
        return Response(
            {"error": f"Error calling AI API: {str(exc)}"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # Try to extract score
    import re
    score_match = re.search(r'(\d+)/10', ai_response)
    score = int(score_match.group(1)) if score_match else 7

    # Save answer
    answer = InterviewAnswer.objects.create(
        question=question,
        answer_text=answer_text,
        feedback=ai_response,
        score=score
    )

    return Response({
        "feedback": ai_response,
        "score": score
    })

@api_view(['GET'])
def get_interview_summary(request, session_id):
    try:
        session = InterviewSession.objects.get(pk=session_id)
    except InterviewSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)

    questions = session.questions.all().order_by('order')
    summary = []
    total_score = 0
    count = 0

    for q in questions:
        ans = q.answers.first() # Assuming one answer per question for simplicity
        if ans:
            summary.append({
                "question": q.question_text,
                "answer": ans.answer_text,
                "feedback": ans.feedback,
                "score": ans.score
            })
            total_score += ans.score
            count += 1

    final_score = (total_score / (count * 10)) * 100 if count > 0 else 0
    session.total_score = int(final_score)
    session.save()

    return Response({
        "job_title": session.job_title,
        "final_score": int(final_score),
        "details": summary
    })
