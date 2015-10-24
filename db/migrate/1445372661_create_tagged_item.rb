class CreateTaggedItem < ActiveRecord::Migration
	def change
		create_table :tagged_items do |t|
      t.integer :tag_id
      t.integer :image_id
    end
	end
end
