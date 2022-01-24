import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Favorite } from '@material-ui/icons';

const api = {
    url: "https://localhost:5001/api/"
}

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(3),
    },
    margin: {
        margin: theme.spacing(1),
    },
    textField: {
        width: "250px",
    },
}));

function AlertInfo(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SearchBar = ({ props }) => {
    const classes = useStyles();
    const [alert, setAlert] = useState(true)
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    const onChangeHandle = async value => {
        console.log(value);
        const response = await fetch(
            `${api.url}city/${value}`
        );
        const countries = await response.json();

        //const countries = [{ "key": 213225, "localizedName": "Jerusalem" }, { "key": 128752, "localizedName": "Jerusalen" }, { "key": 32864, "localizedName": "Jerusalen" }, { "key": 221483, "localizedName": "Jerusalem" }, { "key": 2305887, "localizedName": "Jerusalém" }, { "key": 2310187, "localizedName": "Jerusalém" }, { "key": 1376675, "localizedName": "Jerusalem" }, { "key": 3537004, "localizedName": "Jerusalem" }, { "key": 1062987, "localizedName": "Jerusalem" }, { "key": 2115414, "localizedName": "Jerusalem" }];
        let countries2 = [];
        countries.map(obj => {
            let rObj = {}
            rObj.id = obj.key;
            rObj.label = obj.localizedName;

            countries2.push(rObj);
        });
        setOptions(countries2);
    };

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <React.Fragment>
            <div className={classes.root}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item xs={9} md={4}>
                        <Autocomplete
                            id="asynchronous-demo"
                            style={{ width: 300 }}
                            open={open}
                            onOpen={() => {
                                setOpen(true);
                            }}
                            onClose={() => {
                                setOpen(false);
                            }}
                            getOptionLabel={(option) => {
                                if (option.hasOwnProperty('label')) {
                                    return option.label;
                                }
                                return option;
                            }}
                            onChange={(event, value) => props.setQuery(value.id)}
                            getOptionSelected={(option, value) => option.id === value.id}
                            options={options}
                            loading={loading}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    error
                                    label="Search..."
                                    variant="outlined"
                                    error={(props.error) ? true : false}
                                    onChange={ev => {
                                        // dont fire API if the user delete or not entered anything
                                        if (ev.target.value !== "" || ev.target.value !== null) {
                                            onChangeHandle(ev.target.value);                                            
                                        }
                                    }}
                                    value={props.query}
                                    helperText={(props.error) ? "Enter a valid location" : "Enter a city to begin"}
                                    fullWidth
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="search input"
                                                    onClick={props.search}
                                                    edge="end"
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>,
                                    }} />
                            )}
                        />
                        <Button variant="contained" endIcon={<Favorite />} onClick={props.add2Favorites}>
                            add to Favorites
                        </Button>
                    </Grid>
                </Grid>
            </div>
        </React.Fragment>);
}

export default SearchBar;