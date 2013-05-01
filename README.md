15237 term project
Antonio Ono aono
Deanna Zhu dwz
Norbert Chu nrchu

Spectrum

Our goal is to make a DJing app that can be used simultaneously across multiple devices. Our app is SoundCloud based, and uses both HTML5 Audio and SoundManager to stream songs. We modularize components of a traditional digital or analog DJ setup to be track specific, so we can distribute the interface across a variety of available devices — from handsets to desktops — allowing for both flexibility in controls and a tactile and intuitive user experience.


How to Use

To run the app, run "node app". On a desktop, go to "http://localhost:8999/static/index.html" in your browser. 
On mobile, email/text Deanna your IP address.

This app can be run on multiple devices of varying screen sizes in one session. 
When you first open the app, you should login through SoundCloud.
If your account doesn't have any sets, you should add some sounds because otherwise your setlist is empty.
When you have sets, they should be displayed in the setlist menu and you can choose to add sounds to your session's "setlist" by adding a whole setlist or individual sounds. When you remove a sound from the screen, you remove it from the setlist. You can add it back in by going back to the setlist menu.

We have two modes for playing your setlist. 
In "Autoplay" mode, the next song should begin playing automatically after the current song finishes. 
When also in "Loop" mode, the current setlist should loop around when the last song finishes. 
When Autoplay is off, the user manually determines which song to play next and when.


To play or pause a sound, you just click/press the turntable. For each playing sound, you can adjust the volume, the playback position, the playback rate, and also fade into the next song if there is one. On mobile, besides play/pause, you can only adjust the playback position.


A typical use case in DJing would be to stream audio from one device while pre-listening to the next track through headphones. 
With multiple devices, one device will be the main 

