import pyramid_jinja2
import zeit.remix.zon_api
from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response

import logging

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    with open(settings['api_key']) as f:
	api_key = f.read().strip()
	zeit.remix.zon_api.API_KEY = api_key
    config = Configurator(settings=settings)
    config.include('pyramid_jinja2')
    config.include('pyramid_redis')
    config.add_jinja2_renderer('.tpl')
    #jinja = config.registry.getUtility(pyramid_jinja2.IJinja2Environment)
    config.add_static_view(name='css', path='zeit.remix:static/css/', cache_max_age=3600)
    config.add_static_view(name='js', path='zeit.remix:static/js/', cache_max_age=3600)
    config.add_static_view(name='img', path='zeit.remix:static/img/', cache_max_age=3600)
    config.add_route('home', '/')
    config.add_route('cache-keywords', '/cache-keywords')
    config.add_route('api', '/{endpoint}')
    config.scan()
    return config.make_wsgi_app()

@view_config(route_name='home', renderer='templates/index.tpl')
def my_view(request):
    return {}

class BaseView(object):
    def __init__(self,context,request):
	self.request = request
 

@view_config(route_name='api', renderer='json')
class ZonApiProxy(BaseView):
    def __call__(self):
        api = zeit.remix.zon_api.from_url('http://api.zeit.de'+self.request.path_qs)
        facets = {}
        if api.result.has_key("facets"):
            for k,facet in api.result["facets"].items():
                facets[k] = self._create_facets(facet)
                if k == 'keyword':
                    self._enrich_facets(facets[k])
            api.result['facets'] = facets
        return api.result

    def _create_facets(self,facet):
        list = []
        for i,v in enumerate(facet):
            if (i%2==0):
                f = {'id':v, 'count':facet[i+1]}
                list.append(f)
        return list
    
    def _enrich_facets(self,facet):
        for val in facet:
            data = self.request.redis.get(val['id'])
            if (data is not None):
                val.update(eval(data))
            else:
                logging.warning(val['id']+" was not memcached")


@view_config(route_name='cache-keywords', renderer='json')
class KeywordCacheDb(BaseView):
    def __call__(self):
        api = zeit.remix.zon_api.APIResultset(
                handler="keyword",
                params={'limit':[500],'offset':[0]}
          	)
	
	keywords_written = {'success': 0, 'error': 0}
        for kw in api:
            if kw['id'] is not None:
                logging.info("put keyword "+kw["id"])
                save_to_redis = {'label':kw['lexical'],'type':kw['type']}
                self.request.redis.set(kw['id'], save_to_redis)
                print kw['id']
                keywords_written['success'] += 1
            else:
                keywords_written['error'] += 1
        return keywords_written      
