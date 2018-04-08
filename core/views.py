from django.http import JsonResponse
from django.shortcuts import render

from core.models import Vote, Result

ref = [
    ['horizontal', 'rome'],
    ['vertical', 'rome'],
    ['big', 'rome'],
    ['small', 'rome'],
    ['horizontal', 'pict'],
    ['vertical', 'pict'],
    ['big', 'pict'],
    ['small', 'pict'],
]


def index(request):
    return render(request, 'index.html')


def results(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        answers = request.POST.getlist('answers[]')
        questions = request.POST.getlist('questions[]')
        vote = Vote.objects.create(
            username=username
        )
        for i, answer in enumerate(answers):
            Result.objects.create(
                vote=vote,
                right_answer=questions[i],
                user_answer=answer,
                success=questions[i] == answer,
                type_show=ref[i][0],
                type_font=ref[i][1],
            )

        return JsonResponse({})
    return render(request, 'results.html', {
        'votes': Vote.objects.all(),
        'horizontal': '%s/%s' % (
            Result.objects.filter(success=True, type_show='horizontal').count(),
            Result.objects.filter(type_show='horizontal').count()
        ),
        'vertical': '%s/%s' % (
            Result.objects.filter(success=True, type_show='vertical').count(),
            Result.objects.filter(type_show='vertical').count()
        ),
        'big': '%s/%s' % (
            Result.objects.filter(success=True, type_show='big').count(),
            Result.objects.filter(type_show='big').count()
        ),
        'small': '%s/%s' % (
            Result.objects.filter(success=True, type_show='small').count(),
            Result.objects.filter(type_show='small').count()
        ),
        'rome': '%s/%s' % (
            Result.objects.filter(success=True, type_font='rome').count(),
            Result.objects.filter(type_font='rome').count()
        ),
        'pict': '%s/%s' % (
            Result.objects.filter(success=True, type_font='pict').count(),
            Result.objects.filter(type_font='pict').count()
        ),
    })
