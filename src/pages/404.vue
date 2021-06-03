<template>
  <div id="container">
    <h1>404 Page Not Found</h1>
    <p>The page you requested was not found.</p>
  </div>
</template>

<script>
export default {
  name: 'page404'
}
</script>

<style scoped>
h1 {
  color: #444;
  background-color: transparent;
  border-bottom: 1px solid #D0D0D0;
  font-size: 19px;
  font-weight: normal;
  margin: 0 0 14px 0;
  padding: 14px 15px 10px 15px;
}

#container {
  margin: 40px 50px;
  border: 1px solid #D0D0D0;
  box-shadow: 0 0 8px #D0D0D0;
}

p {
  margin: 12px 15px 12px 15px;
}
</style>