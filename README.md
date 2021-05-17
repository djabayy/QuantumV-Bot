<h3>QuantumV Discord Bot</h3>
<p>This discord bot adds multiple commands to your disord server. You can control your resources with this bot. Search for a user in your database or for a vehicle. Also you can give a item to a player when they're on the server but you're not!</p>
<p>I'll try to explain everything as good as possible!</p>

<h2>Requirements</h2>
<ul>
  <li>node.js</li>
  <li>FiveM Database
    <ul>
      <li>You need <code>firstname</code> and <code>lastname</code> column in order to get it work!</li>
    </ul>
  </li>
  <li>RCON Access (uncomment #rcon_password in your server.cfg)</li>
</ul>

<h2>Installation</h2>
<ol>
<li>Clone this repository into a folder of your choice.</li>
<li>Setup the <code>config.json</code> file.</li>
<li>Start the bot with <code>node .</code> or <code>node index.js</code></li>
<li>Done! Enjoy!</li>
</ol>

<h2>Features</h2>
<ul>
  <li>Changeable prefix in config.json</li>
  <li>Multilanguage compatibel! Just edit the locales.json file and add your own language :)</li>
  <li>Commands
    <ul>
      <li>start / stop / restart resource
      <ul>
          <li>.start RESOURCE</li>
          <li>.stop RESOURCE</li>
          <li>.restart RESOURCE</li>
        </ul>
      </li>
      <li>Search for a player or vehicle
        <ul>
          <li>.user FIRSTNAME LASTNAME</li>
          <li>.plate PLATE</li>
        </ul>
      </li>
      <li>.giveitem ID ITEM COUNT</li>
      <li>.setgroup ID GROUP</li>
      <li>Item Managment
        <ul>
          <li>.finditem ITEM</li>
          <li>.additem [NAME] [LABEL] [WEIGHT]</li>
          <li>.removeitem [NAME]</li>
        </ul>
      </li>
      <li>More commands coming soon...</li>
    </ul>
  </li>
</ul>



<h2>Support</h2>
<p>If you need help with anything you can reach me on discord via <b>👑 Marco#0001</b> or join my discord server! Invite: https://discord.gg/N8kKMFP9tR</p>
