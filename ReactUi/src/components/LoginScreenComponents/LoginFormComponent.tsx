import * as React from "react";
import Axios from "axios";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";

import AccountCircle from "@material-ui/icons/AccountCircleRounded";

import {
  Theme,
  createStyles,
  WithStyles,
  withStyles
} from "@material-ui/core/styles";

import { RedirectToSearchScreen } from "../../components/Redirect";
import { validateEmail, validatePassword } from "../../services/Validation";
import { IValidationResult } from "src/models/Values/IValidationResult";
import { IValue } from "src/models/Values/IValue";

// Props
interface IProps extends WithStyles<typeof styles> {
  loggedIn: boolean;

  updateLoginStatus: (loggedIn: boolean) => void;
}

// State
interface IState {
  values: IValues;
  errors: IErrors;

  isFetching: boolean;
}

interface IValues {
  email: IValue;
  password: IValue;
  rememberMe: boolean;
}

interface IErrors {
  email: IValidationResult;
  password: IValidationResult;
  fetchErrEmail: IValidationResult;
  fetchErrPassword: IValidationResult;
}

// Styles
const styles = (theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: theme.spacing.unit * 10
    },
    formContainer: {
      display: "flex",
      flexDirection: "column"
    },
    formItem: {
      margin: theme.spacing.unit * 3
    },
    logo: {
      marginBottom: theme.spacing.unit
    },
    emailField: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    },
    passwordField: {
      marginTop: theme.spacing.unit,
      marginBottom: theme.spacing.unit
    },
    switchButton: {
      margin: theme.spacing.unit
    }
  });

// Component
class LoginFormComponent extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      values: {
        email: {
          touched: false,
          value: ""
        },
        password: {
          touched: false,
          value: ""
        },
        rememberMe: false
      },
      errors: {
        email: {
          isValid: false,
          errorMsg: null
        },
        password: {
          isValid: false,
          errorMsg: null
        },
        fetchErrEmail: {
          isValid: true,
          errorMsg: null
        },
        fetchErrPassword: {
          isValid: true,
          errorMsg: null
        }
      },

      isFetching: false
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleEmailOnBlur = this.handleEmailOnBlur.bind(this);
    this.handlePasswordOnBlur = this.handlePasswordOnBlur.bind(this);

    this.updateEmail = this.updateEmail.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.updateRememberMe = this.updateRememberMe.bind(this);

    this.tryLogin = this.tryLogin.bind(this);
  }

  public componentDidUpdate() {
    const isFetching = this.state.isFetching;

    if (isFetching) {
      const values = this.state.values;

      Axios.get(
        `http://localhost:2888/api/login/requestlogin?email=${
          values.email.value
        }&password=${values.password.value}`
      )
        .then(res => {
          const errors = this.state.errors;

          errors.fetchErrEmail = {
            isValid: true,
            errorMsg: null
          };
          errors.fetchErrPassword = {
            isValid: true,
            errorMsg: null
          };

          this.setState({
            errors,
            isFetching: false
          });

          this.props.updateLoginStatus(true);
        })
        .catch(err => {
          const resMsg = JSON.parse(err.response.data.Message);
          const errors = this.state.errors;

          if (resMsg.Type === "email") {
            errors.fetchErrEmail = {
              isValid: false,
              errorMsg: resMsg.Message
            };
            errors.fetchErrPassword = {
              isValid: true,
              errorMsg: null
            };
          }
          if (resMsg.Type === "password") {
            errors.fetchErrEmail = {
              isValid: true,
              errorMsg: null
            };
            errors.fetchErrPassword = {
              isValid: false,
              errorMsg: resMsg.Message
            };
          }

          this.setState({
            errors,
            isFetching: false
          });
        });
    }
  }

  public render() {
    const { classes, loggedIn } = this.props;
    const { values, errors, isFetching } = this.state;

    return (
      <Paper className={classes.root}>
        {loggedIn && <RedirectToSearchScreen />}

        {!loggedIn && (
          <form className={classes.formContainer}>
            {!isFetching && <LinearProgress variant="determinate" value={0} />}
            {isFetching && <LinearProgress variant="indeterminate" />}

            <Typography
              className={[classes.formItem, classes.logo].join(" ")}
              align="center"
            >
              <AccountCircle fontSize="large" color="primary" />
            </Typography>

            <Typography align="center" variant="headline">
              Log in
            </Typography>

            <TextField
              className={[classes.formItem, classes.emailField].join(" ")}
              type="email"
              required={true}
              error={Boolean(
                values.email.touched
                  ? errors.fetchErrEmail.isValid
                    ? errors.email.isValid
                      ? false
                      : true
                    : true
                  : false
              )}
              value={values.email.value as string}
              label="Email"
              placeholder="Enter your email address"
              helperText={`${
                values.email.touched
                  ? errors.fetchErrEmail.isValid
                    ? errors.email.isValid
                      ? ""
                      : errors.email.errorMsg
                    : errors.fetchErrEmail.errorMsg
                  : ""
              } `}
              onChange={this.updateEmail}
              onBlur={this.handleEmailOnBlur}
              onKeyDown={this.handleKeyDown}
            />

            <TextField
              className={[classes.formItem, classes.passwordField].join(" ")}
              type="password"
              required={true}
              error={Boolean(
                values.password.touched
                  ? errors.fetchErrPassword.isValid
                    ? errors.password.isValid
                      ? false
                      : true
                    : true
                  : false
              )}
              value={values.password.value as string}
              label="Password"
              placeholder="Enter your password"
              helperText={`${
                values.password.touched
                  ? errors.fetchErrPassword.isValid
                    ? errors.password.isValid
                      ? ""
                      : errors.password.errorMsg
                    : errors.fetchErrPassword.errorMsg
                  : ""
              } `}
              onChange={this.updatePassword}
              onBlur={this.handlePasswordOnBlur}
              onKeyDown={this.handleKeyDown}
            />

            <FormControlLabel
              className={classes.switchButton}
              control={
                <Switch
                  checked={values.rememberMe}
                  onChange={this.updateRememberMe}
                />
              }
              label="Remember me"
            />

            <Button
              disabled={!this.isValidInput()}
              className={classes.formItem}
              variant="contained"
              color="primary"
              onClick={this.tryLogin}
            >
              Login
            </Button>
          </form>
        )}
      </Paper>
    );
  }

  private isValidInput() {
    const errors = this.state.errors;
    return (
      (errors.fetchErrEmail.isValid
        ? errors.email.isValid
          ? true
          : false
        : false) &&
      (errors.fetchErrPassword.isValid
        ? errors.password.isValid
          ? true
          : false
        : false)
    );
  }

  private handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.keyCode === 13 && !this.state.isFetching) {
      if (this.isValidInput()) {
        this.setState({
          isFetching: true
        });
      }
    }
  }

  private handleEmailOnBlur(e: any) {
    const values = this.state.values;
    const errors = this.state.errors;

    values.email.touched = true;
    errors.email = validateEmail(values.email.value as string);

    this.setState({
      values,
      errors
    });
  }

  private handlePasswordOnBlur(e: any) {
    const values = this.state.values;
    const errors = this.state.errors;

    values.password.touched = true;
    errors.password = validatePassword(values.password.value as string);

    this.setState({
      values,
      errors
    });
  }

  private updateEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const emailValue = e.currentTarget.value;

    const values = this.state.values;
    const errors = this.state.errors;

    values.email.value = emailValue;
    errors.email = validateEmail(emailValue);
    errors.fetchErrEmail = {
      isValid: true,
      errorMsg: null
    };

    this.setState({
      values,
      errors
    });
  }

  private updatePassword(e: React.ChangeEvent<HTMLInputElement>) {
    const passwordValue = e.currentTarget.value;

    const values = this.state.values;
    const errors = this.state.errors;

    values.password.value = passwordValue;
    errors.password = validatePassword(passwordValue);
    errors.fetchErrPassword = {
      isValid: true,
      errorMsg: null
    };

    this.setState({
      values,
      errors
    });
  }

  private updateRememberMe(e: React.ChangeEvent<HTMLInputElement>) {
    const rememberMe = e.currentTarget.checked;
    const values = this.state.values;

    values.rememberMe = rememberMe;

    this.setState({
      values
    });
  }

  private tryLogin(e: React.MouseEvent<HTMLButtonElement>) {
    this.setState({
      isFetching: true
    });
  }
}

export default withStyles(styles)(LoginFormComponent);
