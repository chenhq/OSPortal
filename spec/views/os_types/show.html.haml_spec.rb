require 'spec_helper'

describe "os_types/show" do
  before(:each) do
    @os_type = assign(:os_type, stub_model(OsType,
      :name => "Name",
      :family => "Family",
      :desc => "Desc"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
    rendered.should match(/Family/)
    rendered.should match(/Desc/)
  end
end
