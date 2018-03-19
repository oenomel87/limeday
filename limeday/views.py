import json
from django.contrib.auth.models import User
from django.contrib.auth import login
from django.http import JsonResponse

from .forms import UserForm

def id_check(request):
    post = json.loads(request.body.decode('utf-8'))
    response = {}
    try:
        user = User.objects.get(username=post['username'])
        response['result'] = 'IMPOSSIBLE'
    except User.DoesNotExist:
        response['result'] = 'POSSIBLE'
    return JsonResponse(response)

def join(request):
    post = json.loads(request.body.decode('utf-8'))
    form = UserForm(post)
    response = {}
    print(form.errors)
    if form.is_valid():
        new_user = User.objects.create_user(**form.cleaned_data)
        login(request, new_user)
        response['result'] = 'SUCCESS'
    else:
        response['result'] = 'FAIL'
    return JsonResponse(response)
