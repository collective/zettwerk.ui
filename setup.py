from setuptools import setup, find_packages
import os

version = '1.0rc1dev'

setup(name='zettwerk.ui',
      version=version,
      description="Adding jquery.ui and themeroller to plone 4 " \
          "for easy theme customization.",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      # Get more strings from
      # http://pypi.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
        "Framework :: Plone",
        "Programming Language :: Python",
        ],
      keywords='plone, theme, themeroller',
      author='zettwerk GmbH',
      author_email='jk@zettwerk.com',
      url='http://zettwerk.com',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['zettwerk'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
          'collective.js.jqueryui>1.8.13',
          'plone.app.theming'
      ],
      extras_require={
        'test': ['plone.app.testing', 'mocker', 'gocept.selenium']
        },
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      setup_requires=["PasteScript"],
      paster_plugins=["ZopeSkel"],
      )
