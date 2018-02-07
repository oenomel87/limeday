from django.db import models

class User(models.Model):
    '''
    사용자를 나타내는 모델
    '''
    username = models.CharField(max_length=15)
    password = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return self.username

class Event(models.Model):
    '''
    사용자가 등록한 이벤트를 나타내는 모델
    '''
    ENABLE_CHOICE = (
        ('Y', '활성'),
        ('N', '비활성'),
    )

    event_name = models.CharField(max_length=20, help_text='이벤트의 이름을 입력해주세요')
    event_day = models.DateTimeField(help_text='이벤트가 일어날 날짜를 입력해주세요')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    enabled = models.CharField(max_length=1, choices=ENABLE_CHOICE, default='Y')
    timestamp = models.DateTimeField(auto_now_add=True, editable=False)

    def __str__(self):
        return self.event_name + self.event_day.strftime('%Y-%m-%d')
