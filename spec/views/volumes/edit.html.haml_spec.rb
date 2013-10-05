require 'spec_helper'

describe "volumes/edit" do
  before(:each) do
    @volume = assign(:volume, stub_model(Volume))
  end

  it "renders the edit volume form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", volume_path(@volume), "post" do
    end
  end
end
