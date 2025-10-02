import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { 
  classifyError, 
  generateErrorMessages, 
  executeRecoveryAction
} from '../utils/errorRecovery';

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * Features:
 * - Automatic error classification
 * - User-friendly error messages
 * - Recovery action support
 * - Development mode debugging info
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorClassification: null,
      retryCount: 0,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const errorClassification = classifyError(error, errorInfo);
    
    this.setState({
      errorInfo,
      errorClassification
    });

    // Log error in development
    if (import.meta.env.DEV) {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Classification:', errorClassification);
      console.groupEnd();
    }

    // Attempt automatic recovery for recoverable errors
    if (errorClassification.autoRecovery && this.state.retryCount < 3) {
      setTimeout(() => {
        this.handleRecovery();
      }, 1000);
    }

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorClassification);
    }
  }

  handleRecovery = async () => {
    const { errorClassification, retryCount } = this.state;
    
    this.setState({ isRecovering: true });

    try {
      const result = await executeRecoveryAction(
        errorClassification.strategy,
        {
          clearState: this.props.onStateReset,
          reloadComponent: () => this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorClassification: null,
            retryCount: retryCount + 1
          }),
          activateFallback: this.props.onFallbackActivate
        }
      );

      if (result.success) {
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          errorClassification: null,
          isRecovering: false
        });
      }
    } catch (recoveryError) {
      console.error('Recovery failed:', recoveryError);
      this.setState({ isRecovering: false });
    }
  };

  handleManualRecovery = () => {
    // Hard refresh the page as last resort
    window.location.reload();
  };

  render() {
    const { hasError, errorClassification, isRecovering } = this.state;
    const { children, fallbackComponent: FallbackComponent } = this.props;

    if (hasError) {
      // Use custom fallback component if provided
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            errorClassification={errorClassification}
            onRecovery={this.handleRecovery}
            onManualRecovery={this.handleManualRecovery}
            isRecovering={isRecovering}
          />
        );
      }

      // Default fallback UI
      return (
        <DefaultErrorFallback 
          errorClassification={errorClassification}
          onRecovery={this.handleRecovery}
          onManualRecovery={this.handleManualRecovery}
          isRecovering={isRecovering}
        />
      );
    }

    return children;
  }
}

/**
 * Default Error Fallback UI
 */
const DefaultErrorFallback = ({ 
  errorClassification, 
  onRecovery, 
  onManualRecovery, 
  isRecovering 
}) => {
  const messages = errorClassification ? generateErrorMessages(errorClassification) : {
    title: 'Application Error',
    description: 'Something went wrong. Please try refreshing the page.',
    actionText: 'Refresh Page',
    icon: '🚫',
    canRecover: false
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="text-6xl mb-4">{messages.icon}</div>
        
        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {messages.title}
        </h1>
        <p className="text-gray-600 mb-6">
          {messages.description}
        </p>

        {/* Recovery Actions */}
        <div className="space-y-3">
          {messages.canRecover && (
            <button
              onClick={onRecovery}
              disabled={isRecovering}
              className="
                w-full h-12 px-6 text-white bg-blue-600
                hover:bg-blue-700 active:bg-blue-800
                rounded-lg font-medium transition-colors
                focus:outline-none focus:ring-4 focus:ring-blue-200
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isRecovering ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Recovering...
                </div>
              ) : (
                messages.actionText
              )}
            </button>
          )}
          
          <button
            onClick={onManualRecovery}
            className="
              w-full h-12 px-6 text-gray-700 bg-gray-200
              hover:bg-gray-300 active:bg-gray-400
              rounded-lg font-medium transition-colors
              focus:outline-none focus:ring-4 focus:ring-gray-200
            "
          >
            Refresh Page
          </button>
        </div>

        {/* Development Info */}
        {import.meta.env.DEV && errorClassification && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Technical Details (Development)
            </summary>
            <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-800 overflow-auto max-h-48">
              <div><strong>Type:</strong> {errorClassification.type}</div>
              <div><strong>Severity:</strong> {errorClassification.severity}</div>
              <div><strong>Strategy:</strong> {errorClassification.strategy}</div>
              {errorClassification.error && (
                <>
                  <div className="mt-2"><strong>Error Message:</strong></div>
                  <div className="text-red-600">{errorClassification.error.message}</div>
                </>
              )}
              {errorClassification.error?.stack && (
                <>
                  <div className="mt-2"><strong>Stack Trace:</strong></div>
                  <pre className="text-xs text-red-600 whitespace-pre-wrap">{errorClassification.error.stack}</pre>
                </>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

DefaultErrorFallback.propTypes = {
  errorClassification: PropTypes.object,
  onRecovery: PropTypes.func.isRequired,
  onManualRecovery: PropTypes.func.isRequired,
  isRecovering: PropTypes.bool
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallbackComponent: PropTypes.elementType,
  onStateReset: PropTypes.func,
  onFallbackActivate: PropTypes.func,
  onError: PropTypes.func,
};

export default ErrorBoundary;
