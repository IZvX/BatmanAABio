function parseTranscript(transcript) {
    const lines = transcript.split('\n');
    const parsedData = [];
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      if (line === '') {
        continue; // Skip empty lines
      }
  
      const timeCodeRegex = /^(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/;
      const match = line.match(timeCodeRegex);
  
      if (match) {
        const startTime = match[1];
        const endTime = match[2];
        const textLines = [];
  
        // Read the subsequent lines until the next timestamp or end of input
        let j = i + 1;
        while (j < lines.length && !lines[j].trim().match(timeCodeRegex) && lines[j].trim() !== '') {
          textLines.push(lines[j].trim());
          j++;
        }
  
        const text = textLines.join(' ');
        parsedData.push({ startTime, endTime, text });
  
        i = j - 1; // Adjust index to the last processed line. Because the main for loop increments `i`
      }
    }
  
    return parsedData;
  }
  
  function timeCodeToSeconds(timeCode) {
    const [hours, minutes, seconds] = timeCode.split(':');
    const [sec, milliseconds] = seconds.split('.');
    return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(sec, 10) + parseFloat('0.' + milliseconds);
  }
  
  async function displaySubtitles(parsedData) {
    let currentSubtitleIndex = 0;
    const audioElement = document.getElementById('audio');
  
    setInterval(async () => {
        if (audioElement.paused) {
            return;
        }
        const currentTime = audioElement.currentTime; // Get current audio time
        const subtitle = parsedData[currentSubtitleIndex];
        if (subtitle && currentTime >= timeCodeToSeconds(subtitle.startTime) && currentTime <= timeCodeToSeconds(subtitle.endTime)) {
            subs.textContent = subtitle.text
        }

        // Move to the next subtitle if current time has passed
        if (subtitle && currentTime > timeCodeToSeconds(subtitle.endTime)) {
            currentSubtitleIndex++;
        }
    }, 200); // Check every second
  }
  
  // Placeholder function to simulate getting the current audio time
  // In a real application, you would replace this with code that
  // actually reads the current time from your audio player.
  async function getCurrentAudioTime() {
    // This is where you would interact with your audio player's API.
    // For example, if you are using the <audio> element in HTML:
    // return document.querySelector('audio').currentTime;
    // For now, we'll just return a simulated time that increments.
    
    return document.getElementById('audio').currentTime;
  }
  
  
  const transcript = `
  00:00:00.000 --> 00:00:05.000
  Dr. Young: Taped patient interview. Subject has no recorded name, alias listed as the Joker.
  
  00:00:05.000 --> 00:00:08.000
  In the room is Warden Sharp and myself, Dr. Young.
  
  00:00:08.000 --> 00:00:13.000
  Joker: (Ugh) is this another one of those boring psych evaluation tests?
  
  00:00:13.000 --> 00:00:16.000
  Dr. Young: No, it’s not. So, you're the famous Joker.
  
  00:00:16.000 --> 00:00:22.000
  Joker: In the flesh. So Doc, do you want me to look at the ink blots again?
  
  00:00:22.000 --> 00:00:26.000
  The first one is a kitten I had when I was a child.
  
  00:00:26.000 --> 00:00:33.000
  The second one is, hmmm, let's see... a dead elephant. The third is a...
  
  00:00:33.000 --> 00:00:35.000
  Dr. Young: Very funny. Now let’s skip the jokes.
  
  00:00:35.000 --> 00:00:39.000
  Joker: Skip the jokes? Hey, Sharpie, didn’t she get my permanent record?
  
  00:00:39.000 --> 00:00:41.000
  Warden Sharp: Be quiet, clown!
  
  00:00:41.000 --> 00:00:45.000
  Dr. Young: Every doctor that has ever interviewed you claims a different type of psychosis.
  
  00:00:45.000 --> 00:00:50.000
  Everything from multiple personality disorders to well... the list is endless.
  
  00:00:50.000 --> 00:00:53.000
  Joker: (soft giggle) Well, I do my best.
  
  00:00:53.000 --> 00:00:58.000
  Dr. Young: Well, I don’t believe it. Anything can be cured with the correct treatment.
  
  00:00:58.000 --> 00:01:02.000
  Joker: And... you think... you can cure me?
  
  00:01:02.000 --> 00:01:05.000
  Dr. Young: Oh, I know I can.
  `;
  
  const parsedTranscriptData = parseTranscript(transcript);
  
  // Start displaying the subtitles
  displaySubtitles(parsedTranscriptData);