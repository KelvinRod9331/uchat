

return (
    <div id="signup-form-container">
      <p id="signup-title">
        <strong>Sign Up To Chat With Anyone In The World</strong>
      </p>
      <div id="form-container">
        <form onSubmit={submitForm}>
          <input
            class="input"
            id="login-input"
            type="email"
            name="Email"
            placeholder="Email"
            value={emailInput}
            onChange={handleEmailChange}
          />
          <br />
          <input
            class="input"
            id="login-input"
            type="text"
            name="Full name"
            placeholder="Full name"
            value={fullNameInput}
            onChange={handleFullNameChange}
          />
          <br />
          <input
            class="input"
            id="login-input"
            type="text"
            name="username"
            placeholder="Username"
            value={usernameInput}
            onChange={handleUsernameChange}
          />
          <br />
          <input
            class="input"
            id="login-password"
            type="password"
            name="password"
            placeholder="Password"
            value={passwordInput}
            onChange={handlePasswordChange}
          />
          <br />
          <input
            class="input"
            id="login-password"
            type="password"
            name="confirm-input"
            placeholder="Confirm Password"
            value={confirmInput}
            onChange={handleConfirmChange}
          />
          <br />

           <FormControl
          componentClass="select"
          placeholder="select"
          bsClass="formControlsSelect"
          onChange={handleCountrySelector}
          
        >
          {countries.map((c, i) => {
            return (
              <option key={i} value={c.code}>
                {c.name}
              </option>
            );
          })}
        </FormControl>
        <br />

          <FormControl
          componentClass="select"
          placeholder="select"
          bsClass="formControlsSelect"
          onChange={handleLanguageSelector}
          
        >
          {languages.map((lan, i) => {
            return (
              <option key={i} value={lan.abbreviation}>
                {lan.name}
              </option>
            );
          })}
        </FormControl>
        <br />

          <input
            class="input"
            id="login-submit"
            type="submit"
            value="Sign Up"
          />

          <p>{message}</p>
          <p id="question">
            Have an account? <Link to="/login">Log In</Link>
          </p>
        </form>
      </div>
    </div>
);




