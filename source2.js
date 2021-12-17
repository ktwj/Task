/*
<ul>
<li>Animals
  <ul>
    <li>Mammals
      <ul>
        <li>Cows</li>
        <li>Donkeys</li>
        <li>Dogs</li>
        <li>Tigers</li>
      </ul>
    </li>
    <li>Other
      <ul>
        <li>Snakes</li>
        <li>Birds</li>
        <li>Lizards</li>
      </ul>
    </li>
  </ul>
</li>
<li>Fishes
  <ul>
    <li>Aquarium
      <ul>
        <li>Guppy</li>
        <li>Angelfish</li>
      </ul>
    </li>
    <li>Sea
      <ul>
        <li>Sea trout</li>
      </ul>
    </li>
  </ul>
</li>
</ul>

<script>
  
let lis = document.getElementsByTagName('li');
for(let li of lis){
    let count = li.getElementsByTagName('li').length;
    if(count==0){
        continue;
    }
    li.firstChild.data += `[${count}]`;
}

</script>
*/