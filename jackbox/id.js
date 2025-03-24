const binUrl = 'https://api.jsonbin.io/v3/b/67e10e718a456b79667b8270/latest';

fetch(binUrl)
  .then(response => response.json())
  .then(data => {
    const videoID = data.video_id;
    console.log(videoId);
  })
  .catch(error => {
    console.error('Error fetching the video ID:', error);
  });
