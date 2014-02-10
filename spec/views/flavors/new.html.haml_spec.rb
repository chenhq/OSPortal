require 'spec_helper'

describe "flavors/new" do
  before(:each) do
    assign(:flavor, stub_model(Flavor,
      :alias => "MyString",
      :name => "MyString",
      :vcpus => 1,
      :memory_mb => 1,
      :flavorid => "MyString"
    ).as_new_record)
  end

  it "renders new flavor form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", flavors_path, "post" do
      assert_select "input#flavor_alias[name=?]", "flavor[alias]"
      assert_select "input#flavor_name[name=?]", "flavor[name]"
      assert_select "input#flavor_vcpus[name=?]", "flavor[vcpus]"
      assert_select "input#flavor_memory_mb[name=?]", "flavor[memory_mb]"
      assert_select "input#flavor_flavorid[name=?]", "flavor[flavorid]"
    end
  end
end
