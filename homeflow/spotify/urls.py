from django.urls import path
from .views import AuthURL, spotify_callback, IsAuthenticated, CurrentSong, PlayPauseSong, SkipSong

urlpatterns = [ 
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('current-song', CurrentSong.as_view()),
    path('play-pause-song', PlayPauseSong.as_view()),
    path('skip', SkipSong.as_view()),
]