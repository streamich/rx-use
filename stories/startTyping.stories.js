import {startTyping$} from '../src/startTyping$';

export default {
  title: 'startTyping$',
};

export const Default = () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <div style="padding: 20px; font-family: Arial;">
      <h2>startTyping$ Demo</h2>
      <p>Start typing any letter or number when not focused on an input field:</p>
      <div id="output" style="background: #f0f0f0; padding: 10px; margin: 10px 0; min-height: 100px;">
        No typing events yet...
      </div>
      <p>Test with inputs (typing should NOT trigger when focused):</p>
      <input type="text" placeholder="Type here - should NOT trigger startTyping$" style="padding: 8px; margin: 5px;"><br>
      <textarea placeholder="Type here - should NOT trigger startTyping$" style="padding: 8px; margin: 5px;"></textarea><br>
      <div contenteditable="true" style="border: 1px solid #ccc; padding: 8px; margin: 5px;">
        Contenteditable div - typing here should NOT trigger startTyping$
      </div>
    </div>
  `;
  
  const output = container.querySelector('#output');
  const events = [];
  
  startTyping$.subscribe(event => {
    events.push({
      key: event.key,
      keyCode: event.keyCode,
      time: new Date().toLocaleTimeString()
    });
    
    // Keep only last 10 events
    if (events.length > 10) {
      events.shift();
    }
    
    output.innerHTML = events.length === 0 
      ? 'No typing events yet...'
      : events.map(e => `${e.time}: "${e.key}" (keyCode: ${e.keyCode})`).join('<br>');
  });
  
  return container;
};