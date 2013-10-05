require 'spec_helper'

describe "volumes/index" do
  before(:each) do
    assign(:volumes, [
      stub_model(Volume),
      stub_model(Volume)
    ])
  end

  it "renders a list of volumes" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
