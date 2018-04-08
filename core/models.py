from django.db import models


class Vote(models.Model):
    username = models.CharField(max_length=254)

    @property
    def result(self):
        return Result.objects.filter(vote=self, success=True).count()

    @property
    def total(self):
        return Result.objects.filter(vote=self).count()

    def __str__(self):
        return self.username


class Result(models.Model):
    vote = models.ForeignKey(Vote, on_delete=models.CASCADE, related_name='results')
    right_answer = models.CharField(max_length=254)
    user_answer = models.CharField(max_length=254)
    success = models.BooleanField()
    type_show = models.CharField(max_length=20)
    type_font = models.CharField(max_length=20)

    def __str__(self):
        return '%s: %s' % (self.vote, self.right_answer)
