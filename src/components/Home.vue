<template>
  <v-container>
    <v-layout xs12 pl-2>
      <v-flex>
        <input
          type="file"
          ref="fileInput"
          id="file"
          @change="processFile($event)"
        >
      </v-flex>
    </v-layout>
    <br>
    <v-layout xs12 pb-3>
      <v-flex>
        <v-btn
          color="primary"
          @click="uploadFile"
        >Enviar</v-btn>
      </v-flex>
    </v-layout>
    <v-divider></v-divider>
    <v-layout
      row
      wrap
      align-center
    >
      <v-flex xs12>
        <v-container
          fluid
          class="pl-0 pr-0"
        >
          <v-layout row wrap>
            <v-flex 
              xs12
              sm6
              lg3
              v-for="image in images"
              v-bind:key="image.id"
            >
              <v-card>
                <v-img
                  height="200px"
                  :src="image.url"
                >
                </v-img>
                <v-card-title>
                  <div>
                    <span class="grey--text"> {{image.name}} </span>
                    <v-chip> {{image.scorePromedio}} </v-chip>
                    <br>
                  </div>
                </v-card-title>
                <v-card-actions>
                  <v-btn flat @click="goToImageDetail($image.id)">Explore</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { firestore } from '@/main'
import { storage } from '@/main'
  export default {
    name: 'Home',
    data: () => ({
      file: '',
      images: []
    }),
    methods: {
      processFile: function(event) {
        this.file = event.target.files[0]
      },
      uploadFile: function() {
        let name = (+new Date()) + '-' + this.file.name
        let metadata = { contentType: this.file.type }
        storage.child(name).put(this.file, metadata)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          let image = {
            url: url,
            name: name,
            createdAt: (+new Date()),
            scorePromedio: 0
          }
          firestore.collection('images').add(image)
        })
      },
      goToImageDetail: function() {
        // this.$router.push({ path: '/image/${id}'})
      }
    },
    firestore() {
      return {
        // Queries de las bases de datos
        images: firestore.collection('images')
      }
    }
    
  }
</script>
