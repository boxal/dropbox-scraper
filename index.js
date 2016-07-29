const scrape = require('./utils/scrape');
var io = require('socket.io')(9000);

const URL = 'https://www.dropbox.com/sc/klv66uya4eidmxw/AABY2r4LvVIwSBZ2AcOrR92Wa';
const noop = () => {};

const scrapeImageFileLinks = scrape(getImageFileLinks);
const scrapePreviewImageSrcset = scrape(getPreviewImageSrcset);

function doStuff(albumPage) {
  return scrapeImageFileLinks(albumPage)
    .flatMap(x => x)
    .flatMap(scrapePreviewImageSrcset);
}

function getImageFileLinks() {
  const anchors = document.getElementsByClassName('file-link');
  return [].map.call(anchors, (element) => element.getAttribute('href'));
}

function getPreviewImageSrcset() {
  const image = document.getElementsByClassName('preview-image')[0];
  return image.getAttribute('srcset');
}

io.on('connection', (socket) => {
  socket.on('album-link', (url) => {
    doStuff(url).subscribe((data) => {
      socket.emit({
        srcset: data,
      });
    });
  })
});

doStuff(URL).subscribe(
  function (x) {
    console.log('Next: ' + x);
  },
  function (err) {
    console.log('Error: ' + err);
  },
  function () {
    console.log('completed');
  }
);
