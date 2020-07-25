var parser = require('./parser');

console.log(JSON.stringify(parser(`
<script>let a = 1;</script>
`)));