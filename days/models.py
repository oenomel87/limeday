from datetime import date, datetime
from django.db import models
from django.contrib.auth.models import User
import pytz

class Day(models.Model):
    '''
    사용자가 등록한 날을 나타내는 모델
    '''
    ENABLE_CHOICE = (
        ('Y', '사용'),
        ('N', '미사용'),
    )

    day_name = models.CharField(max_length=20, help_text='이벤트의 이름을 입력해주세요')
    dday = models.DateTimeField(help_text='이벤트가 일어날 날짜를 입력해주세요', default=datetime.now().replace(hour=0,minute=0,second=0,microsecond=0,tzinfo=pytz.timezone('Asia/Seoul')))
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    enabled = models.CharField(max_length=1, choices=ENABLE_CHOICE, default='Y')
    timestamp = models.DateTimeField(auto_now_add=True, editable=False)

    def get_ddays(self):
        today = datetime.now().replace(hour=0,minute=0,second=0,microsecond=0,tzinfo=pytz.timezone('Asia/Taipei'))
        diff = (self.dday - today).days
        if diff == 0:
            return 'D - day'
        elif diff < 0:
            return 'D + ' + str(-1 * diff)
        else:
            return 'D - ' + str(diff)

    def __str__(self):
        return self.day_name + ' ' + self.dday.strftime('%Y-%m-%d')
