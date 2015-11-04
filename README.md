# Face Recognition as Service

## Setup:
1. Go to ```root``` folder:
  ```
  npm install
  ```

2. Go to ```web``` folder
  ```
  bower install
  ```
  
## Startup:
1. Go to ```root``` folder:
  ```
  node index.js
  ```
  
2. Go to [http://localhost:3000/index.html](http://localhost:3000/index.html) in Chrome

## Output Image Location:
We capture images from webcam every second and save into this location for Karthik's algorithm. It is important to have the right location. Otherwise, car counting won't work.

Go to ```root\config.json```
```
{
	"imageLocation": "<YOUR IMAGE OUTPUT LOCATION>"
}
```

