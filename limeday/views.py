import json
from django.contrib.auth.models import User

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
    pass
