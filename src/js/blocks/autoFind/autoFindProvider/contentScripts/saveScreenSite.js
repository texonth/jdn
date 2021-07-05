import html2canvas from 'html2canvas';

export const saveScreenSite = () => {
    html2canvas(document.body, 
      {
        onrendered: function (canvas) {
          var a = document.createElement('a');
          // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
          a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
          a.download = 'sitescreen.jpg';
          a.click();
        }
    });
  };