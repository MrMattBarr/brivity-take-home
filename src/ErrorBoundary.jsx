import React, { useEffect, useReducer } from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log("oh noooo");
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="bg-red-400 h-screen text-white flex justify-center items-center">
          <div className="rounded p-10 border-4 border-white text-center bg-blue-400">
            <div className="text-red-900">Oh no... the app crashed.</div>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_new"
              className="font-bold underline text-black"
            >
              click here to fix it
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
