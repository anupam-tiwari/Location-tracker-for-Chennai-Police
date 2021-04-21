<template>
  <div class="admin-view">
    <section class="left-view">
      <div class="ui segment center aligned">
        <div v-if="user">{{ user.email }}</div>
        <div>Admin</div>
        <button class="ui button red" @click="signOutButtonPressed">
          Signout
        </button>
      </div>
      <div class="ui segment">
        <div class="ui divided items">
          <div class="item" v-for="driver in drivers" :key="driver.id">
            <div class="content">
              <div class="header">{{ driver.email }}</div>
              <div class="meta">
                Lat : {{ driver.lat }}
                <br />
                Lng :{{ driver.lng }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="right-view" ref="map"></section>
  </div>
</template>

<script>
import firebase from "firebase";
import normalPoll from "./data/new-polling-location.json";
import vulnerablePoll from "./data/vulnerable.json";
import clusterPoll from "./data/cluster-polls.json";
import blue from "./parking_lot_maps.png";
import beachflag from "./beachflag.png";



export default {
  data() {
    return {
      user: null,
      drivers: [],
      map: null,
    };
  },

  async mounted() {
    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
    });

    this.map = new google.maps.Map(this.$refs["map"], {
      zoom: 15,
      center: new google.maps.LatLng(12.8236848, 80.0250148),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    const { docs } = await firebase
      .firestore()
      .collection("users")
      .where("active", "==", true)
      .get();

    const markers = [];
    const infoWindows = [];

    //for only mapping

    const normal = blue;

    const vulnerable =beachflag;
    const cluster = {
      path:
        "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
      fillColor: "blue",
      fillOpacity: 0.8,
      strokeWeight: 0,
      rotation: 0,
      scale: 1,
      anchor: new google.maps.Point(15, 30),
    };

    //for normalPoll
    for (let i = 0; i < normalPoll.length; i++) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          normalPoll[i].Latitude,
          normalPoll[i].Longitude
        ),
        icon: normal,
        map: this.map,
      });
    }

    //for vulnerable
    for (let i = 0; i < vulnerablePoll.length; i++) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          vulnerablePoll[i].Latitude,
          vulnerablePoll[i].Longitude
        ),
        icon: vulnerable,
        map: this.map,
      });
    }
    //for cluster polls
    for (let i = 0; i < clusterPoll.length; i++) {
      const marker = new google.maps.Marker({
        position: new google.maps.LatLng(
          clusterPoll[i].Latitude,
          clusterPoll[i].Longitude
        ),
        icon: cluster,
        map: this.map,
      });
    }

    for (let i = 0; i < docs.length; i++) {
      markers.push(
        new google.maps.Marker({
          map: this.map,
        })
      );

      infoWindows.push(new google.maps.InfoWindow({ disableAutoPan: true }));
    }

    firebase
      .firestore()
      .collection("users")
      .where("active", "==", true)
      .onSnapshot((snap) => {
        this.drivers = [];
        for (let i = 0; i < snap.docs.length; i++) {
          var driver = snap.docs[i].data();
          this.drivers.push(driver);

          markers[i].setPosition(
            new google.maps.LatLng(driver.lat, driver.lng)
          );

          infoWindows[i].setContent(
            `<div class="ui header">${driver.email} </div>`
          );
          infoWindows[i].open(this.map, markers[i]);
        }
      });
  },

  methods: {
    signOutButtonPressed() {
      firebase
        .auth()
        .signOut()
        .then((user) => {
          this.$router.push({
            name: "Signin",
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
  },

  //multiple markers

  /*const poll1s = [];
   for (let i = 0; i < dataPoll.length; i++) {
          var poll1 = dataPoll.Id[i].data();
          this.poll1s.push(poll1);

          markers[i].setPosition(
            new google.maps.LatLng(driver.lat, driver.lng)
          );

          infoWindows[i].setContent(
            `<div class="ui header">${driver.email} </div>`
          );
          infoWindows[i].open(this.map, markers[i]);
        }
      });*/
};
</script>

<style>
.admin-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
}
.left-view {
  width: 250px;
  padding: 12px;
}

.right-view {
  flex-grow: 1;
}
</style>