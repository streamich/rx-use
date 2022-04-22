# Tab List

- Assigns a random ID to each tab.
- Keeps track of all browser tabs on the same origin.
- Elects a *leader* tab. Tab with the highest ID is the leader. Technically
  this will not be 100% accurate, but most of the time there will be a
  single leader.
- Allows to establish a two-way communication channel between any two tabs.
