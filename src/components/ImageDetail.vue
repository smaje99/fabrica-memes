<template>
    <v-container>
        <v-layout
            xs12
            pl-2
            row
            wrap
            align-center
        >
            <v-flex
                xs12
                sm6
                md6
                lg4
            >
                <v-card>
                    <v-img
                        class="white--text"
                        height="200px"
                        :src="image.url"
                    ></v-img>
                    <v-card-title v-if="image">
                        <div>
                            <span class="grey--text"> {{image.name}} </span>
                            <v-chip :color="selectClass">{{ image.scorePromedio }}</v-chip>
                            <br>
                            <span>{{ image.labels | separateLabels }}</span>
                        </div>
                    </v-card-title>
                </v-card>
            </v-flex>
        </v-layout>
        <v-layout>
            <v-flex xs12 pt-5>
                <v-text-field
                    label="Qué te parece esta foto?"
                    v-model="comentario"
                ></v-text-field>
                <v-layout>
                    <v-layout>
                        <v-flex x12 pt-5>
                            <v-btn
                                primary
                                @click="enviarComentario"
                            >Enviar</v-btn>
                        </v-flex>
                    </v-layout>
                    <v-flex x12 pt-5>
                        <h1>Otros comentarios</h1>
                    </v-flex>
                </v-layout>
                <v-layout
                    v-for="comentario in comentarios"
                    v-bind:key="comentario.id"
                >
                    <v-flex x12>
                        <v-text-field
                            :value="comentario.texto"
                            :label="comentario.score"
                            readonly
                        ></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { firestore } from "@/main"
    // import { storage } from "@/main"
    import { keyNLP } from '@/credentials/credentials'
    import axios from 'axios'

    export default {
        name: 'ImageDetail',
        data () {
            return {
                apiKey: keyNLP,
                id: this.$route.params.id,
                image: '',
                comentario: '',
                comentarios: []
            }
        },
        methods: {
            enviarComentario: function() {
                const data = {
                    "document": {
                        "type": "PLAIN_TEXT",
                        "lenguage": "ES",
                        "content": this.comentario
                    },
                    "encodignType": "UTF8"
                }
                    
                axios.post('https://language.googleapis.com/v1/documents:analyzeSentiment?key=' + this.apiKey, data)
                .catch(error => {
                    console.log(error.message)
                })
                .then(response => {
                    const score = response.data.documentSentiment.score
                    let comentario = {
                        imageId: this.id,
                        texto: this.comentario,
                        createdAt: (+new Date()),
                        score: score
                    }
                    firestore.collection('comentarios').add(comentario).then(() => {
                        const length = this.comentarios.length
                        let scorePromedio = 0
                        this.comentarios.forEach(function(comentario) {
                            scorePromedio = scorePromedio + comentario.score
                        })
                        scorePromedio = scorePromedio / length

                        // Update scorePromedio de la imagen
                        firestore.collection("images").doc(this.id).set({
                            scorePromedio: scorePromedio
                        }, {merge: true})
                        this.comentario = ''
                    })
                })    
            }
        },
        firestore () {
            return {
                image: firestore.collection('images').doc(this.id),
                comentarios: firestore.collection('comentarios').where("imageId", "==", this.id)
            }
        },
        
        filters: {
            separateLabels: function(value) {
                return value[0] + ', ' + value[1] + ', ' + value[2]
            }
        }
    }
</script>