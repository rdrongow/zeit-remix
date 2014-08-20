import urllib
import urllib2
import urlparse
import json

API_URL = "http://api.zeit.de"
API_KEY = ""

class APIResultset:
    limit = 10
    offset = 0
    result = None
    request = None
    params = None
    found = 0

    def __init__(self, handler = None, params = None):
        if params:
            if ( params.has_key("limit") ):
                self.limit = params['limit'][0]
                del params["limit"]
            if ( params.has_key("offset") ):
                self.offset = params['offset'][0]
                self.initial_offset = params['offset'][0]
                del params["offset"]
        if params:
            self.params = params
        if handler:
            self.handler = handler
        self.retrieve_result()

    def retrieve_result(self):
        self.full_url = "%s/%s?offset=%s&limit=%s" % (
            API_URL,
            self.handler,
            self.offset,
            self.limit,
        )
        if (self.params):
            self.full_url = "%s&%s" % (
                self.full_url,
                urllib.urlencode(self.params,1)
            )
        headers = {'X-Authorization': API_KEY }
        self.request = urllib2.Request(self.full_url, headers=headers)
        resp = urllib2.urlopen(self.request)
        self.result = json.load(resp)
        self.found = self.result["found"]
        self.iterator = enumerate(self.result["matches"])

    def __iter__(self):
        return self

    def next(self):
        if (self.result):
            try:
                next = self.iterator.next()
                self.current = next[0]
                return next[1]
            except StopIteration:
                if self.current+1+self.offset == self.found:
                    self.offset = self.initial_offset
                    self.retrieve_result()
                    raise StopIteration
                elif self.current==self.limit-1:
                    self.offset+=self.limit
                    self.retrieve_result()
                    return self.next()

def from_url(full_url):
    up = urlparse.urlparse(full_url)
    handler = up.path[1:]
    params = urlparse.parse_qs(up.query)
    return APIResultset(handler=handler, params=params)
