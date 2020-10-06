import React from "react";

import "./App.css";
import ColorDummyData from "./datajson/colorDummy.json";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

type Color = {
  name: string;
  hex: string;
  hsl: string;
};

// style my components material ui
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    column: {
      float: "left",
      width: "20%",
      height: "80px",
    },
    combox: {
      margin: "20px",
    },
  })
);

//  Dummy data color
const categoryDummy: Color[] = [
  {
    name: "Red",
    hex: "#EE204D",
    hsl: "(110, 81, 96)",
  },
  {
    name: "Yellow",
    hex: "#FCE883",
    hsl: "(110, 81, 96)",
  },
  {
    name: "Blue",
    hex: "#1F75FE",
    hsl: "(110, 81, 96)",
  },
  {
    name: "Green",
    hex: "#1CAC78",
    hsl: "(110, 81, 96)",
  },
  {
    name: "Orange",
    hex: "#FD5E53",
    hsl: "(253, 94, 83)",
  },
  {
    name: "Violet",
    hex: "#C0448F",
    hsl: "(192, 68, 143)",
  },
];

// function rendom data
const shuffleArray = (arrData: Color[]) => {
  for (let i = arrData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arrData[i];
    arrData[i] = arrData[j];
    arrData[j] = temp;
  }
  return arrData;
};

function App() {
  const classes = useStyles();
  const [stateColor, setStateColor] = React.useState<Color[]>([]);
  const [stateSaturate, setStateSturate] = React.useState("saturate(1)");
  const [stateCheckbox, setStateCheckbox] = React.useState(false);
  const [stateFilterCheckbox, setStateFilterCheckbox] = React.useState(false);
  //filter data checkbox
  const filterDataCheckbox = async (newData: Color[]) => {
    let bigDataFilter: Color[] = [];
    for (let i = 0; i < newData.length; i++) {
      const hslColorArr = newData[i].hsl.split("").slice(0, -1);
      await hslColorArr.shift();
      const tamp = hslColorArr.toString().replace(/[^\w\s]/gi, "");
      const converArr = tamp.split(" ", 3);
      const hsl = parseInt(converArr[2]);
      if (newData[i] && hsl > 60) {
        bigDataFilter.push(newData[i]);
      }
    }
    setStateColor(bigDataFilter);
  };

  // filter data
  const filterData = (value: string) => {
    if (stateColor.length === 0) {
      const randomColor = shuffleArray(ColorDummyData);
      setStateColor(randomColor);
    } else {
      const filterData = ColorDummyData.filter(function (item) {
        return item.name.toLowerCase().includes(value.toLocaleLowerCase());
      }).map(function ({ hex, name, hsl }) {
        return { hex, name, hsl };
      });
      setStateColor(filterData);
    }
  };

  // retrieve initial color data
  React.useEffect(() => {
    const unsub = async () => {
      try {
        const result = await setStateColor(shuffleArray(ColorDummyData));
        return result;
      } catch (error) {
        alert(error.message);
        console.log(error);
      }
    };
    unsub();
    //eslint-desable-next-line
  }, []);

  return (
    <div className="App">
      <Grid>
        {/* auto complate category, filter by name color*/}
        <Grid container justify="flex-start">
          <Autocomplete
            id="combo-box-demo"
            options={categoryDummy}
            getOptionLabel={(option: Color) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="...Search category"
                variant="outlined"
              />
            )}
            onChange={(event, newValue) => {
              if (newValue !== null) {
                filterData(newValue.name);
              } else {
                setStateColor(shuffleArray(ColorDummyData));
              }
            }}
          />
        </Grid>
        {/* end */}

        {/* checkbox saturate set saturate true = +4 flase = 1*/}
        <FormControlLabel
          className={classes.combox}
          control={
            <Checkbox
              checked={stateCheckbox}
              onChange={() => {
                setStateCheckbox(!stateCheckbox);
                if (stateCheckbox === false) {
                  setStateSturate("saturate(4)");
                } else {
                  setStateSturate("saturate(1)");
                }
              }}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          }
          label="Set All saturation  "
        />
        {/* end */}

        <FormControlLabel
          className={classes.combox}
          control={
            <Checkbox
              checked={stateFilterCheckbox}
              onChange={() => {
                setStateFilterCheckbox(!stateFilterCheckbox);
                if (stateFilterCheckbox === false) {
                  filterDataCheckbox(stateColor);
                } else {
                  setStateColor(shuffleArray(ColorDummyData));
                }
              }}
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          }
          label=" filter saturation"
        />

        {/* Grid newdata color */}
        <Grid
          container
          justify="center"
          spacing={1}
          style={{ backgroundColor: "rgb(33 40 43)", color: "white" }}
        >
          {stateColor.map((newData, index) => {
            return (
              <Grid key={index} item className={classes.column}>
                <Paper
                  className={classes.paper}
                  id={newData.name}
                  style={{
                    backgroundColor: `hsl${newData.hsl}`,
                    filter: `${stateSaturate}`,
                  }}
                />
                <span>{newData.name}</span>
              </Grid>
            );
          })}
        </Grid>
        {/* end */}
      </Grid>
    </div>
  );
}

export default App;
