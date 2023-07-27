from django.shortcuts import render, redirect
from .credentials import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from requests import Request, post
from .util import *
from api.models import Room
import logging

logger = logging.getLogger(__name__)


class AuthURL(APIView):
    def get(self, request, format=None):
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': SPOTIFY_REDIRECT_URI,
            'client_id': SPOTIFY_CLIENT_ID,
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET,
    }

    response = post('https://accounts.spotify.com/api/token', data=data).json()
    access_token = response.get('access_token')
    refresh_token = response.get('refresh_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')
    error = response.get('error')


    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(session_id=request.session.session_key, access_token=access_token, 
                                 refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)

    return redirect('frontend:')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        logger.info("here")
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        logger.info(is_authenticated)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
    
class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({'error' : 'no room passed or found'}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = 'player/currently-playing'
        response = execute_spotify_api_request(host, endpoint)

        if 'error' in response or 'item' not in response:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = response.get('item')
        duration = item.get('duration_ms')
        progress = item.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        logger.info(item)
        logger.info(item.get('artist'))

        artist_string = ""
        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "

            name = artist.get('name')
            artist_string += name

        song = {
            'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id,
        }

        logger.info(song)

        return Response(song, status=status.HTTP_200_OK)

