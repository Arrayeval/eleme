<template>
  <div class="myTest">
    <p>{{msg}}</p>

  </div>
</template>

<script>
  export default {
    name: ' ',
    data () {
      return {
          msg: 'myTest'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .myTest {
    color:red;
  }

</style>
