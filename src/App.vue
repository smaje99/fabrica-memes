<template>
  <v-app>
    <v-toolbar
      color="indigo"
      dark
      fixed
      app
    >
      <v-toolbar-title>Fabricas de Memes</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-layout>
          <router-view/>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style>

</style>
