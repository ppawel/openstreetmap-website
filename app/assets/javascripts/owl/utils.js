function hasIcon(tags) {
  return iconTags(tags).length > 0;
}

function iconTags(tags) {
  var a = [];
  $.each (OWL.iconTags, function (index, tag) {
    if (tag in tags) {
      a.push(tags[tag]);
      a.push(tag);
    }
  });
  return a;
}

function classForChange(el_type, tags) {
  if (!hasIcon(tags)) { return ""; }
  var cls;
  if (el_type == 'W') {
    cls = 'way ';
  } else if (el_type == 'N') {
    cls = 'node ';
  }
  cls += iconTags(tags).join(' ');
  return cls;
}

function hrefForChange(change) {
  return OSM.OWL_LINKS_BASE_URL
    + 'browse/'
    + (change.el_type == 'N' ? 'node' : 'way')
    + '/'
    + change.el_id;
}

function nameForChange(change) {
  var friendlyTagInfo = null, name = null;
  if (change.prev_tags) {
    friendlyTagInfo = findTagWithFriendlyName(change.prev_tags);
    name = findName(change.prev_tags);
  }
  if (change.tags) {
    if (friendlyTagInfo == null) {
      friendlyTagInfo = findTagWithFriendlyName(change.tags);
    }
    if (name == null) {
      name = findName(change.tags);
    }
  }
  if (!name) {
    name = change.id;
  }
  var result = '';
  if (friendlyTagInfo) {
    result = friendlyTagInfo.toLowerCase();
    if (name) {
      result += ' (' + name + ')';
    }
  } else {
    result = name;
  }
  return result;
}

// Searches for a tag that has a translation and returns the translation or null if no such tags found.
function findTagWithFriendlyName(tags) {
  var result = null;
  $.each(tags, function (k, v) {
    if (I18n.lookup('geocoder.search_osm_nominatim.prefix.' + k + '.' + v)) {
      result = I18n.t('geocoder.search_osm_nominatim.prefix.' + k + '.' + v);
      return false;
    }
  });
  return result;
}

function findName(tags) {
  var result = null;
  if ('name' in tags) {
    result = tags['name'];
  }
  return result;
}


function findChangesetId(el) {
  return findDataValue(el, 'changeset-id');
}

function findChangeId(el) {
  return findDataValue(el, 'change-id');
}

// Tries to find data with given key attribute for given element (searches parents if needed).
function findDataValue(el, key) {
  var result = null;
  $.each([$(el), $(el).parent(), $(el).parent().parent()], function (index, e) {
      if (e.data(key)) {
        result = e.data(key);
        return false;
      }
  });
  if (result) {
    result = parseInt(result);
  }
  return result;
}