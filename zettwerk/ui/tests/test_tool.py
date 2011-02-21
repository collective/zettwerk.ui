import unittest
from base import ZETTWERK_UI_INTEGRATION_TESTING


from Products.CMFCore.utils import getToolByName
from zope.component import getMultiAdapter


class TestTool(unittest.TestCase):

    layer = ZETTWERK_UI_INTEGRATION_TESTING

    def test_cp_view(self):
        portal = self.layer['portal']
        request = self.layer['request']
        tool = getToolByName(portal, 'portal_ui_tool')
        view = getMultiAdapter((tool, request),
                               name='ui-controlpanel')
        content = view()
        self.assertTrue(content.find('class="template-ui-controlpanel') != -1)

        ## search the 3 fieldsets
        fieldset = '<fieldset id="fieldset-settings">'
        self.assertTrue(content.find(fieldset) != -1)
        fieldset = '<fieldset id="fieldset-theme">'
        self.assertTrue(content.find(fieldset) != -1)
        fieldset = '<fieldset id="fieldset-themeroller">'
        self.assertTrue(content.find(fieldset) != -1)

    def test_cp_js_translations(self):
        ## thats a bit odd, and mainly for coverage
        portal = self.layer['portal']
        tool = getToolByName(portal, 'portal_ui_tool')
        self.assertTrue(tool.cp_js_translations().startswith('var '))

    def test_js(self):
        portal = self.layer['portal']
        tool = getToolByName(portal, 'portal_ui_tool')

        self.assertTrue(tool.enableFonts)
        self.assertTrue(tool.js().find('enableFonts()') != -1)
        tool.enableFonts = False
        self.assertTrue(tool.js().find('enableFonts()') == -1)

        self.assertTrue(tool.enableDialogs)
        self.assertTrue(tool.js().find('enableDialogs()') != -1)
        tool.enableDialogs = False
        self.assertTrue(tool.js().find('enableDialogs()') == -1)

        self.assertTrue(tool.enableStatusMessage)
        self.assertTrue(tool.js().find('enableStatusMessage()') != -1)
        tool.enableStatusMessage = False
        self.assertTrue(tool.js().find('enableStatusMessage()') == -1)

        self.assertTrue(tool.enableForms)
        self.assertTrue(tool.js().find('enableForms()') != -1)
        tool.enableForms = False
        self.assertTrue(tool.js().find('enableForms()') == -1)

        self.assertTrue(tool.enableTabs)
        self.assertTrue(tool.js().find('enableTabs()') != -1)
        tool.enableTabs = False
        self.assertTrue(tool.js().find('enableTabs()') == -1)

        self.assertTrue(tool.enableGlobalTabs)
        self.assertTrue(tool.js().find('enableGlobalTabs()') != -1)
        tool.enableGlobalTabs = False
        self.assertTrue(tool.js().find('enableGlobalTabs()') == -1)

        self.assertTrue(tool.enablePortlets)
        self.assertTrue(tool.js().find('enablePortlets()') != -1)
        tool.enablePortlets = False
        self.assertTrue(tool.js().find('enablePortlets()') == -1)

        self.assertTrue(tool.enableFooter)
        self.assertTrue(tool.js().find('enableFooter()') != -1)
        tool.enableFooter = False
        self.assertTrue(tool.js().find('enableFooter()') == -1)

        self.assertTrue(tool.enableEditBar)
        self.assertTrue(tool.js().find('enableEditBar()') != -1)
        tool.enableEditBar = False
        self.assertTrue(tool.js().find('enableEditBar()') == -1)

        self.assertTrue(tool.js().find('removeRules()') != -1)

        ## and the translations are also included
        self.assertTrue(tool.js().find('var sorry_only_firefox') != -1)

    def test_css(self):
        portal = self.layer['portal']
        tool = getToolByName(portal, 'portal_ui_tool')

        self.assertEquals(tool.theme, '')
        self.assertTrue(tool.css().find('zettwerk.ui.themes') == -1)
        tool.theme = 'tester'
        self.assertTrue(tool.css().find('/tester/') != -1)

        self.assertTrue(tool.enableForms)
        self.assertTrue(tool.css().find('#searchGadget') != -1)
        tool.enableForms = False
        self.assertTrue(tool.css().find('#searchGadget') == -1)

        self.assertTrue(tool.enableStatusMessage)
        self.assertTrue(tool.css().find('.ui-custom-status-container') != -1)
        tool.enableStatusMessage = False
        self.assertTrue(tool.css().find('.ui-custom-status-container') == -1)

        self.assertTrue(tool.enableTabs)
        self.assertTrue(tool.css().find('.ui-tabs-nav') != -1)
        tool.enableTabs = False
        self.assertTrue(tool.css().find('.ui-tabs-nav') != -1)
        tool.enableGlobalTabs = False
        self.assertTrue(tool.css().find('.ui-tabs-nav') == -1)

        self.assertTrue(tool.enableFooter)
        self.assertTrue(tool.css().find('#portal-footer') != -1)
        tool.enableFooter = False
        self.assertTrue(tool.css().find('#portal-footer') == -1)

        self.assertTrue(tool.enablePersonalTool)
        self.assertTrue(tool.css().find('.actionMenu') != -1)
        tool.enablePersonalTool = False
        self.assertTrue(tool.css().find('.actionMenu') == -1)

    def test__redirectToCPView(self):
        portal = self.layer['portal']
        tool = getToolByName(portal, 'portal_ui_tool')

        result = tool._redirectToCPView()
        self.assertTrue(result.endswith('@@ui-controlpanel'))

        result = tool._redirectToCPView(u'tester')
        from Products.statusmessages.interfaces import IStatusMessage
        status_messages = IStatusMessage(self.layer['request']) \
            .showStatusMessages()
        self.assertEquals(len(status_messages), 1)
        self.assertEquals(status_messages[0].message, u'tester')

    def test__rebuildThemeHashes_empty(self):
        portal = self.layer['portal']
        tool = getToolByName(portal, 'portal_ui_tool')

        self.assertTrue(tool.themeHashes is None)
        tool._rebuildThemeHashes()
        from persistent.mapping import PersistentMapping
        self.assertTrue(isinstance(tool.themeHashes, PersistentMapping))

    def test__rebuildThemeHashes_with_theme(self):
        pass
        ## XXX
