import pyramid_jinja2
import zeit.remix.zon_api
from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response


def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with open(settings['api_key']) as f:
	api_key = f.read().strip()
	zeit.remix.zon_api.API_KEY = api_key
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.add_jinja2_renderer('.tpl')
    #jinja = config.registry.getUtility(pyramid_jinja2.IJinja2Environment)
    config.add_static_view(name='css', path='zeit.remix:static/css/', cache_max_age=3600)
    config.add_static_view(name='js', path='zeit.remix:static/js/', cache_max_age=3600)
    config.add_static_view(name='img', path='zeit.remix:static/img/', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('api', '/{endpoint}')
    config.scan()
    return config.make_wsgi_app()

@view_config(route_name='home', renderer='templates/index.tpl')
def my_view(request):
    return {}

@view_config(route_name='api', renderer='json')
class ZonApiProxy(object):
    def __init__(self,context,request):
	self.request = request
    
    def __call__(self):
        api = zeit.remix.zon_api.from_url('http://api.zeit.de'+self.request.path_qs)
        facets = {}
        if api.result.has_key("facets"):
            for k,facet in api.result["facets"].items():
                facets[k] = self._create_facets(facet)
            api.result['facets'] = facets
        return api.result

    def _create_facets(self,facet):
        list = []
        for i,v in enumerate(facet):
            if (i%2==0):
                list.append({'id':v,
                             'count':facet[i+1]})
        return list

    def _enrich_facets(self,facet):
        for val in facet:
            data = memcache.get(val['id'])
            if (data is not None):
                val.update(data)
            else:
                logging.warning(val['id']+" was not memcached")
                val.update(self.__query_kw__(val['id']))

    def __query_kw__(self,id):
        #kw = Keyword.get_by_key_name(
        #    id, parent=keywords_key()
        #    )
        data = {'not_in_dict':True}
        #if kw is not None:
        #    data = {'label':kw.label,'type':kw.type}
        memcache.add(id, data)
        return data
