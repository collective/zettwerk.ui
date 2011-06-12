from Products.CMFCore.utils import getToolByName


def disable_sunburst_patch(context):
    """ we must disable the patch of collective.js.jqueryui to sunburst
    to make our font colors work.
    """
    site = context.getSite()
    portal_css = getToolByName(site, 'portal_css')
    portal_css.getResourcesDict() \
        .get('++resource++jquery-ui-themes/sunburst-patch.css') \
        .setEnabled(False)
    ## thats always disabled. if it is needed, we link
    ## it directly (see tool.tool.UITool.css)
    portal_css.getResourcesDict() \
        .get('++resource++jquery-ui-themes/sunburst/jqueryui.css') \
        .setEnabled(False)