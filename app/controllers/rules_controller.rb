require 'openstack_activeresource'
class RulesController < ApplicationController
  def auth
    OpenStack::Keystone::Public::Base.site = "http://122.227.254.55:5000/v2.0/"

    # Authentication
    auth = OpenStack::Keystone::Public::Auth.create :username => "admin", :password => "175245a126f74b02", :tenant_id => "e486e554e533455b83389720826d4c80"

    # Set the auth token for next API requests
    OpenStack::Base.token = auth.token

    # Set the Nova Compute API endpoint from the received service catalog
    OpenStack::Nova::Compute::Base.site = auth.endpoint_for('compute').publicURL
  end

  def new
    auth
    @rule = OpenStack::Nova::Compute::Rule.new(:ip_protocol => "TCP",
                                               :from_port   => "22",
                                               :to_port     => "22",
                                               :cidr        => "0.0.0.0/0")
    respond_to do |format|
      format.json { render json: @rule }
    end
  end

  def create
  end

  def destory
  end
end
