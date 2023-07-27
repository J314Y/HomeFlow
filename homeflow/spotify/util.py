from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import Request, post
from .credentials import SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI
import logging
from requests import post, put, get

logger = logging.getLogger(__name__)

BASE_URL = "https://api.spotify.com/v1/me/"

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None

def update_or_create_user_tokens(session_id, access_token, refresh_token, token_type, expires_in):
    tokens = get_user_tokens(session_id)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(update_fields=['access_token', 'refresh_token', 'token_type', 'expires_in'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token, refresh_token=refresh_token, 
                              token_type=token_type, expires_in=expires_in)
        tokens.save()

def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    logger.info(tokens)
    logger.info(tokens.expires_in)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(tokens)
        return True

    return False

def refresh_spotify_token(tokens):
    refresh_token = tokens.refresh_token

    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
    }

    response = post('https://accounts.spotify.com/api/token', data=data).json()


    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(session_id=tokens.user, access_token=access_token, refresh_token=refresh_token,
                                 token_type=token_type, expires_in=expires_in)

    return True

def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):
    tokens = get_user_tokens(session_id=session_id)
    headers = { 'content_type': 'application/json', 'Authorization': 'Bearer ' + tokens.access_token }
    
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)

    try:
        return response.json()
    except:
        return { 'Error': 'Issue with Request' }
