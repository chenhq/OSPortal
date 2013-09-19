class ApplicationController < ActionController::Base
  protect_from_forgery
  include SessionsHelper

  # Force signout to prevent CSRF attacks
  def handle_unverified_reuqest
    signout
    super
  end

end
