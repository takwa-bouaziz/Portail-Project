from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from cover_letter.models import CoverLetter
from cv_tools.models import CvMatchAnalysis, CvRewriteResult, HrCvRanking, HrInterviewGuide
from interview.models import InterviewSession

from .models import UserProfile


def _user_payload(user):
    profile, _ = UserProfile.objects.get_or_create(user=user)
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "role": profile.role,
        "role_label": profile.get_role_display(),
    }


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    username = str(data.get("username", "")).strip()
    email = str(data.get("email", "")).strip()
    password = data.get("password", "")
    first_name = str(data.get("first_name", "")).strip()
    last_name = str(data.get("last_name", "")).strip()
    role = data.get("role", UserProfile.CANDIDATE)

    if not username or not password:
        return Response(
            {"error": "username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if role not in dict(UserProfile.ROLE_CHOICES):
        return Response({"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST)

    duplicate_query = Q(username=username)
    if email:
        duplicate_query |= Q(email=email)

    if User.objects.filter(duplicate_query).exists():
        return Response(
            {"error": "A user with this username or email already exists"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )
    profile, _ = UserProfile.objects.get_or_create(user=user)
    profile.role = role
    profile.save()
    login(request, user)

    return Response({"user": _user_payload(user)}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    login(request, user)
    return Response({"user": _user_payload(user)})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)
    return Response({"message": "Logged out"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({"user": _user_payload(request.user)})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_history(request):
    cover_letters = [
        {
            "id": item.id,
            "type": "cover_letter",
            "title": f"Lettre - {item.job_title}",
            "subtitle": item.company_name,
            "created_at": item.created_at,
            "score": None,
        }
        for item in CoverLetter.objects.filter(user=request.user)
    ]
    interviews = [
        {
            "id": item.id,
            "type": "interview",
            "title": f"Entretien - {item.job_title}",
            "subtitle": "Simulation d'entretien",
            "created_at": item.created_at,
            "score": item.total_score,
        }
        for item in InterviewSession.objects.filter(user=request.user)
    ]
    matches = [
        {
            "id": item.id,
            "type": "cv_match",
            "title": "Matching CV / offre",
            "subtitle": item.matching_summary[:90],
            "created_at": item.created_at,
            "score": item.matching_score,
        }
        for item in CvMatchAnalysis.objects.filter(user=request.user)
    ]
    rewrites = [
        {
            "id": item.id,
            "type": "cv_rewrite",
            "title": f"Reformulation - {item.section_name}",
            "subtitle": item.target_role or "Section CV",
            "created_at": item.created_at,
            "score": None,
        }
        for item in CvRewriteResult.objects.filter(user=request.user)
    ]
    guides = [
        {
            "id": item.id,
            "type": "hr_interview_guide",
            "title": f"Guide entretien - {item.job_title}",
            "subtitle": f"{len(item.questions)} questions préparées",
            "created_at": item.created_at,
            "score": None,
        }
        for item in HrInterviewGuide.objects.filter(user=request.user)
    ]
    rankings = [
        {
            "id": item.id,
            "type": "hr_cv_ranking",
            "title": f"Classement CV - {item.job_title}",
            "subtitle": f"{len(item.ranking)} candidats analysés",
            "created_at": item.created_at,
            "score": item.ranking[0].get("score") if item.ranking else None,
        }
        for item in HrCvRanking.objects.filter(user=request.user)
    ]

    items = sorted(
        cover_letters + interviews + matches + rewrites + guides + rankings,
        key=lambda item: item["created_at"],
        reverse=True,
    )
    return Response({"items": items})
