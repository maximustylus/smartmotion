# Rehearsal checklist

For the shared screen on Zoom. Read once, keep open on the second screen.

## Before you share

- Open https://smartmotion.web.app/talk in Chrome, full screen (`F`).
- The splash plays on every load. Press any key to skip it, or load
  `/talk?nosplash` to rehearse without it.
- Press `D` if the room is bright and you want the light theme.
- Press `Shift+R` to zero the timer, then `T` to show it. The clock starts
  when you leave the cover.
- Press `Z` on the live totals beat to zero the room counters shown on
  this screen. The counters in Firestore are never cleared; the screen
  subtracts what was there.
- Have `/play` open on your own phone to check the quiz works on the day's
  network.

## During

| Key | Does |
| --- | --- |
| `→` `↓` space, clicker | Next beat |
| `←` `↑` | Previous beat |
| `Q` | A large QR code for the quiz, any time |
| `O` | Overview of every scene, with TODO count |
| `B` or `.` | Black screen |
| `Esc` | Close any window |
| `?` | All shortcuts |

Scrolling with the trackpad also works, but keys land exactly on a beat.

## Order of the talk route

Cover, 1963, quiz (8 min), have an angle (5), 1997, test it (7), reality
check (7), 2011, use cases (15), frameworks (10), 2022, use it safely (6),
2025, take-home (2), questions. The rail at the top shows time budget by
width; the glowing segment is where you are.

## If something fails

- **Firestore unreachable**: each phone still shows its own result; the
  totals beat says "Room totals are unavailable right now". Carry on.
- **Motus offline**: he says so in the chat. He still travels and reacts.
  He only answers when the Cloud Function is deployed with a key.
- **A phone cannot scan**: the short link is smartmotion.web.app/play.
- **Frames stutter on the share**: the field lowers its own quality after a
  second or so. If it still stutters, press `B` for the beat and carry on;
  the copy is the content.
- **The page is stuck on a beat**: press `O`, click the scene.

## Still TODO in visible content

**The talk is shown clean.** On /talk the TODO chips and verify badges are
hidden from the shared screen, and any line left empty goes with them. They
are still in the page: `O` counts them, the playbook at / shows them all, and
/talk?todo shows them on the talk. Four beats are a heading only until their
content arrives, so present them from your own notes: the three use cases
(NEXUS and AURA, C.A.R.E., ImmersiFit) and the frameworks worked example.

As of 5 October 2026 the talk holds 21 markers: 9 verify badges and the
content gaps below.

- Build on solid frameworks: the worked example, from the three use cases.
- Use it safely: the Will Smith clip links and dates, and the Mothership
  link.
- Test for usefulness: the cost examples, with a retrieval date.
- Give it a reality check: the Karpathy interview cited and the wording
  verified.
- Have an angle, and Know your way around the files: the framework and its
  source.
- Have an angle: Killingsworth and Gilbert (2010) verified.

The four type names are confirmed (Analyst, Designer, Organiser,
Storyteller) and no longer a TODO.
