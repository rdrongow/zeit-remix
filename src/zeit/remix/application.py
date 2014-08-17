from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    config = Configurator(settings=settings)
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/{name}')
    config.scan()
    return config.make_wsgi_app()

@view_config(route_name='home')
def hello_world(request):
    return Response('Hello %(name)s!' % request.matchdict)
