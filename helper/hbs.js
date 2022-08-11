const moment = require("moment");

module.exports = {
  formatDate: (date, format) => moment(date).format(format),
  truncate: (str, len) => str.substr(0, len) + "...",
  stripTags: (input) => input.replace(/<(?:.|\n)*?>/gm, ""),
  editIcon: (storyUser, loggedUser, storyId, floating = true) => {
    if (storyUser._id.toString() !== loggedUser._id.toString()) return "";
    if (floating)
      return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
    return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
  },
  select: (selected, options) => {
    return options
      .fn(this)
      .replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"')
      .replace(new RegExp(">" + selected + "</option>"), ' selected="selected"$&');
  },
};
