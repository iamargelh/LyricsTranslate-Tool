import response from '../mockup/musicbrainz_artist.json' with { type: "json" }

console.log(response.relations[2].url.resource)