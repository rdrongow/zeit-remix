#!/usr/bin/python
# -*- coding: utf-8 -*-

from setuptools import setup, find_packages

setup(
    name='zeit.remix',
    version='0.1.dev0',
    author=u'Ron Drongowski',
    author_email='ron.drongowski@zeit.de',
    package_dir={'': 'src'},
    packages=find_packages('src'),
    entry_points={
        'paste.app_factory': [
            'main=zeit.remix.application:main',
        ],
    },
    extras_require={
        'test': [],
    },
    install_requires = [
         'setuptools',
         'pyramid',
         'pyramid_jinja2',
	 'redis',
	 'zope.component',
	 'zope.interface',
         ],
    namespace_packages=['zeit'],
)
